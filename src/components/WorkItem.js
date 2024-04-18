import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function WorkItem({ work, deleteWork }) {
    const navigate = useNavigate();

    return (
        <Card>
            <Card.Body>
                <Card.Title>{work.name}</Card.Title>
                <Card.Text>{work.description}</Card.Text>
                <Button variant='danger' style={{ float: 'right' }} className='mx-3' onClick={() => (deleteWork(work.id))}>Удалить</Button>
                <Button variant='primary' style={{ float: 'right' }} onClick={() => (navigate(`/work/${work.id}`))}>Пройти</Button>
            </Card.Body>
        </Card>
    )
}

export default WorkItem