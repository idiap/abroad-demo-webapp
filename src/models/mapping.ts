// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface Mapping {
  head: MappingHead
  results: MappingResults
}

interface MappingHead {
  link: string[]
  vars: string[]
}

interface MappingResults {
  distinct: boolean
  ordered: boolean
  bindings: MappingBinding[]
}

export interface MappingBinding {
  main_gbif: BindingData
  main_gbif_id: BindingData
  specie_label: BindingData
}

interface BindingData {
  type: string
  value: string
}
