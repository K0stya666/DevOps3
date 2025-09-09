terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
  required_version = ">= 0.13"
}

provider "yandex" {
  token     = "y0__xCh8NLnBRjB3RMg5eCaphRnFYGG5mq8vact1_EEIzJjaL-3yQ"
  cloud_id  = "b1g0m7dlds35t25mqpvc"
  folder_id = "b1ghuulab94793d4h4eq"
  zone      = "ru-central1-a"
}

resource "yandex_compute_instance" "library-vm" {
  name        = "library-app-vm"
  platform_id = "standard-v1"
  zone        = "ru-central1-a"

  resources {
    cores  = 2
    memory = 2
  }

  boot_disk {
    initialize_params {
      image_id = "fd8kdq6d0p8sij7h5qe3"
      size     = 20
    }
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.library-subnet.id
    nat       = true
  }

  metadata = {
    user-data = "#cloud-config\nusers:\n  - name: ubuntu\n    groups: sudo\n    shell: /bin/bash\n    sudo: ['ALL=(ALL) NOPASSWD:ALL']\n    ssh-authorized-keys:\n      - ${file("~/.ssh/id_rsa.pub")}"
  }
}

resource "yandex_vpc_network" "library-network" {
  name = "library-network"
}

resource "yandex_vpc_subnet" "library-subnet" {
  name           = "library-subnet"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.library-network.id
  v4_cidr_blocks = ["192.168.10.0/24"]
}

output "external_ip" {
  value = yandex_compute_instance.library-vm.network_interface.0.nat_ip_address
}
