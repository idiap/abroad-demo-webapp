// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface OrganismInfo {
  head: OrganismInfoHead
  results: OrganismInfoResults
}

interface OrganismInfoHead {
  link: string[]
  vars: string[]
}

interface OrganismInfoResults {
  distinct: boolean
  ordered: boolean
  bindings: OrganismInfoBinding[]
}

export interface OrganismInfoBinding {
  concat_synonyms: BindingData
  specie_authorship: BindingData
  specie_dataset: BindingData
  specie_label: BindingData
  specie_publication: BindingData
  specie_rank: BindingData
  specie_sc_name: BindingData
  specie_status: BindingData
}

interface BindingData {
  type: string
  value: string
}
