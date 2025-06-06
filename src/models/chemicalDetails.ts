// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface ChemicalDetails {
  head: ChemicalDetailsHead
  results: ChemicalDetailsResults
}

interface ChemicalDetailsHead {
  link: string[]
  vars: string[]
}

interface ChemicalDetailsResults {
  distinct: boolean
  ordered: boolean
  bindings: ChemicalDetailsBinding[]
}

export interface ChemicalDetailsBinding {
  content_type: BindingData
  doi: BindingData
  pmid: BindingData
  re_score: BindingData
  rel_type: BindingData
  tiab_content: BindingData
}

interface BindingData {
  type: string
  value: string
}
