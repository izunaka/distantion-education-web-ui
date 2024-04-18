import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import WorksList from '../components/WorksList'
import { $host } from '../http';

function AllWorks() {
    const [works, setWorks] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [workToDelete, setWorkToDelete] = useState();

    useEffect(() => { $host.get('studentworks/get').then(response => setWorks(response.data)) }, []);

    const showDeleteConfirmation = (workId) => {
        setWorkToDelete(workId);
        setShowDialog(true);
    };

    const deleteWork = () => {
        $host.post(`studentworks/delete/${workToDelete}`).then(response => {
            setWorks(works.filter(work => work.id !== workToDelete));
        }).finally(response => {
            setWorkToDelete();
            setShowDialog(false);
        })
    };

    return (
        <Container className='my-2'>
            <Row>
                <Col>
                    <WorksList works={works} deleteWork={showDeleteConfirmation} />
                </Col>
            </Row>

            <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите удалить работу?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={deleteWork}>
                        Да
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDialog(false)}>
                        Нет
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default AllWorks
