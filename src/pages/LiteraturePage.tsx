// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPubmedtiab } from "../api/chemicals"
import { Col, Row, Spin, Typography } from "antd"
import { Pubmedtiab } from "../models/pubmedtiab"
import Title from "antd/es/typography/Title"

const { Text } = Typography


const LiteraturePage: React.FC = () => {
  const [pubmedtiab, setPubmedtiab] = useState<Pubmedtiab>()
  const [spinning, setSpinning] = useState<boolean>(false)
  const { pmid } = useParams()
  useEffect(() => {
    setSpinning(true)
    Promise.all([getPubmedtiab(pmid as string)]).then(values => {
      setPubmedtiab(values[0])
      setSpinning(false)
    }).catch(() => {
      setSpinning(false)
    })
  }, [pmid])
  return <Row style={{
    margin: 'auto',
    padding: 32,
    width: '100%',
    maxWidth: 1200,
  }}>
    <Col
      style={{
        width: '100%',
      }}
    >
      <Title>Literature</Title>
      <Row>
        <Text strong>PMID:</Text>
        <Text>{pmid}</Text>
      </Row>
      <Row>
        <Text strong>Title:</Text>
        <Text>{pubmedtiab?.results.bindings[0].title.value ?? 'unknown'}</Text>
      </Row>
      <Row>
        <Text strong>Abstract:</Text>
        <Text>{pubmedtiab?.results.bindings[0].abstract.value ?? 'unknown'}</Text>
      </Row>
      <Spin spinning={spinning} fullscreen />
    </Col>
  </Row>
}

export default LiteraturePage
