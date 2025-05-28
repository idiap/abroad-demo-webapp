// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Col, Row, Typography, AutoComplete, Spin, Checkbox, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { mapping as fetchMapping } from '../api/mapping';
import { alerts as fetchAlerts } from '../api/alerts'
import { useNavigate } from 'react-router-dom';

import { TableAlerts } from '../models/tableAlerts';
import AlertTableView from '../components/AlertsView';

const { Title } = Typography

interface Option {
  key: string
  value: string
  id: string
}

const HomePage: React.FC = () => {

  const [mapping, setMapping] = useState<Option[]>([])
  const [alerts, setAlerts] = useState<TableAlerts | null>(null)
  const [searchResult, setSearchResult] = useState<Option[]>([])
  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState<string>('Strong');
  const navigate = useNavigate()

  const onSearch = (searchText: string) => {
    return setSearchResult(searchText ? mapping.filter(option => option.value.toLowerCase().includes(searchText.toLowerCase())) : [])
  }
  
  const handleCheckboxChange = (value: string) => {
    setSelectedCheckbox(value);
    fetchAlerts(value);
  };

  useEffect(() => {
    setSpinning(true)
    fetchMapping()
      .then(mappingResult => {
        const result = mappingResult.results.bindings.filter(binding => binding.specie_label.value.length > 0).map((binding, index) => {
          let gbif = Number(binding.main_gbif.value.split('/').at(-1))
          const gbifString = Number.isNaN(gbif) ? binding.main_gbif_id.value : gbif.toString()
          const option: Option = {
            key: `${index}`,
            value: `${binding.specie_label.value} (id: ${gbifString})`,
            id: gbifString,
          }
          return option
        })
        setMapping(result)
        setSearchResult(result)
        setSpinning(false)
      })
      .catch(() => setSpinning(false))
  }, [])

  useEffect(() => {
    if (selectedCheckbox) {
        setSpinning(true)
        fetchAlerts(selectedCheckbox)
        .then(alertResult => {
            setAlerts(alertResult)
            setSpinning(false)
        })
        .catch(() => {
            setSpinning(false)
        })
    }
  }, [selectedCheckbox])

  return <Row style={{
    margin: 'auto',
    width: '100%',
    maxWidth: '800px',
  }}>
    <Col
      style={{
        width: '100%',
      }}
    >
      <Title
        style={{
          marginTop: 64,
          textAlign: 'center'
        }}
      >
        ABRoad
      </Title>
      <AutoComplete
        options={searchResult}
        onSearch={onSearch}
        onSelect={(text, option) => {
          navigate(`/literature-chemicals/${option.id}`)
        }}
        style={{
          width: '100%',
        }}
        size='large'
        placeholder="Insert an organism name"
      />
      <div style={{ marginTop: 20 }}>
        <Typography.Title level={5}>Type of evidences</Typography.Title>
        <Checkbox checked={selectedCheckbox === 'Strong'} onChange={() => handleCheckboxChange('Strong')}>
        <Tooltip title="The evidence for the antibiotic potential of the organism or isolated chemicals are clear and strong.">
        Strong
        </Tooltip>
        </Checkbox>
        <Checkbox checked={selectedCheckbox === 'Medium'} onChange={() => handleCheckboxChange('Medium')}>
        <Tooltip title="The evidence for the antibiotic potential of the organism or isolated chemicals are indirects or need to be confirmed by further experiments.">
        Medium
        </Tooltip>
        </Checkbox>
        <Checkbox checked={selectedCheckbox === 'Weak'} onChange={() => handleCheckboxChange('Weak')}>
        <Tooltip title="No evidence">
        Weak
        </Tooltip>
        </Checkbox>
      </div>
      <Spin spinning={spinning} fullscreen />
      <AlertTableView alerts={alerts} />
    </Col>
  </Row>
}

export default HomePage
