import React from 'react'
import { Col, Row } from 'react-bootstrap'
import WorkItem from './WorkItem'

function WorksList({ works, deleteWork }) {
    return (
        <Row className='d-flex'>
            {
                works.map(work => (
                    <Col md={12} className='mt-4' key={work.id}>
                        <WorkItem work={work} deleteWork={deleteWork} />
                    </Col>
                ))
            }
        </Row>
    )
}

export default WorksList