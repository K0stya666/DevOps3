terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
}

provider "yandex" {
  service_account_key_file = "./sa-key.json"
  cloud_id  = "b1g0m7dlds35t25mqpvc"
  folder_id = "b1ghuulab94793d4h4eq"
  zone      = "ru-central1-d"
}

resource "yandex_compute_instance" "lab-server-2" {
  name        = "lab-server-2-terraform"
  platform_id = "standard-v3"
  zone        = "ru-central1-d"

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
    subnet_id = "fl85rk3psbkc9kfe6m0e"
    nat       = true
  }

  metadata = {
    ssh-keys = "anastasiiadzhev:${file("~/.ssh/id_rsa.pub")}"
  }
}

output "external_ip" {
  value = yandex_compute_instance.lab-server-2.network_interface.0.nat_ip_address
}
