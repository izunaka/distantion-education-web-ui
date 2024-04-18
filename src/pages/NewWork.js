import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Form, Col, Row, Modal } from 'react-bootstrap'
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { $host } from '../http';
import { useNavigate } from 'react-router-dom';

function NewWork() {
    const navigate = useNavigate();

    const [taskTypes, setTaskTypes] = useState([]);
    const [validated, setValidated] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [workId, setWorkId] = useState();
    const [work, setWork] = useState({
        name: '',
        description: '',
        tasks: [
            {
                description: '',
                type: {},
                answers: []
            }
        ]
    });

    useEffect(() => { $host.get('tasktypes/get').then(response => setTaskTypes(response.data)) }, []);

    const handleErrorClose = () => setShowError(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);

        if (form.checkValidity() === false) {
            setErrorText('Необходимо заполнить все обязательные поля!');
            setShowError(true);
            return;
        }

        $host.post('studentworks/create', work).then(response => {
            setWorkId(response.data.id);
            setShowDialog(true);
        });
    };

    const addTask = () => {
        setWork({
            ...work,
            tasks: [
                ...work.tasks,
                {
                    description: '',
                    type: {},
                    answers: []
                }
            ]
        });
    };

    const deleteTask = (index) => {
        if (work.tasks.length === 1) {
            setErrorText('В списке не может быть менее одного элемента!');
            setShowError(true);
            return;
        }

        setWork({
            ...work,
            tasks: work.tasks.filter((task, i) => i !== index)
        });
    };

    const setType = (index, value) => {
        const id = Number(value);
        work.tasks[index].type.id = id;
        work.tasks[index].answers = [
            {
                description: '',
                isRight: true
            }
        ];
        setWork(deepCopy(work));
    };

    const setTaskDescription = (index, value) => {
        work.tasks[index].description = value;
        setWork(deepCopy(work));
    }

    const addAnswer = (index) => {
        work.tasks[index].answers.push({
            description: '',
            isRight: false
        });
        setWork(deepCopy(work));
    }

    const deleteAnswer = (index, ansIndex) => {
        if (work.tasks[index].answers.length === 1) {
            setErrorText('В списке не может быть менее одного элемента!');
            setShowError(true);
            return;
        }

        work.tasks[index].answers = work.tasks[index].answers.filter((ans, i) => i !== ansIndex);
        setWork(deepCopy(work));
    }

    const setAnswerText = (taskIndex, ansIndex, value) => {
        const task = work.tasks[taskIndex];
        task.answers[ansIndex].description = value;
        setWork(deepCopy(work));
    }

    const setAnswerRight = (taskIndex, ansIndex) => {
        const task = work.tasks[taskIndex];
        const type = getType(task.type.id);
        if (type.rule.answer === 0 && !task.answers[ansIndex].isRight) {
            task.answers.forEach(ans => { ans.isRight = false });
        }
        task.answers[ansIndex].isRight = !task.answers[ansIndex].isRight;
        setWork(deepCopy(work));
    }

    const getType = (id) => taskTypes.find(type => type.id === id);

    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

    return (
        <Container className='my-3'>
            <h3>Создание новой работы</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit} className='my-3'>
                <Form.Group className='my-4' controlId='nameValidation'>
                    <Form.Label><h4>Название работы:</h4></Form.Label>
                    <Form.Control
                        value={work.name}
                        onChange={event => setWork({ ...work, name: event.target.value })}
                        required
                        type="text"
                        placeholder="Название работы"
                    />
                    <Form.Control.Feedback type='invalid'>Необходимо заполнить!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='my-4'>
                    <Form.Label><h4>Описание работы:</h4></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Описание работы"
                        value={work.description}
                        onChange={event => setWork({ ...work, description: event.target.value })}
                    />
                </Form.Group>

                <h4>Список заданий:</h4>

                {
                    work.tasks.map((task, index) => (
                        <Card className='my-3 py-3' key={index}>
                            <Form.Group className='mx-4' controlId={`taskNameValidation-${index}`}>
                                <Form.Control
                                    value={task.description}
                                    onChange={event => setTaskDescription(index, event.target.value)}
                                    required
                                    as="textarea"
                                    rows={3}
                                    placeholder="Текст задания"
                                />
                                <Form.Control.Feedback type='invalid'>Необходимо заполнить!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='mt-3 mx-4' style={{ width: 410 }} controlId={`taskTypeValidation-${index}`}>
                                <Form.Select
                                    value={task.type.id}
                                    required
                                    onChange={event => setType(index, event.target.value)}
                                >
                                    <option></option>
                                    {
                                        taskTypes.map(type => (
                                            <option value={type.id}>{type.description}</option>
                                        ))
                                    }
                                </Form.Select>
                                <Form.Control.Feedback type='invalid'>Необходимо заполнить!</Form.Control.Feedback>
                            </Form.Group>

                            <div className='mt-3 mx-4'>
                                {
                                    task.type?.id
                                        ? getType(task.type?.id)?.rule?.type
                                            ? (
                                                <div>
                                                    Ответы:
                                                    <Button className='mx-2' variant='light' onClick={() => addAnswer(index)}>
                                                        <FaPlusCircle color='green' size='1.5em' />
                                                    </Button>
                                                </div>
                                            )
                                            : (
                                                <div>
                                                    Ответ:
                                                </div>
                                            )
                                        : ''
                                }
                            </div>

                            {
                                task.answers.map((answer, ansIndex) => (
                                    getType(task.type.id).rule.rule === 2
                                        ? (
                                            <Form.Group className='mt-1 mx-4' key={ansIndex} controlId={`answerValidation-${index}-${ansIndex}`}>
                                                <Form.Control
                                                    as="textarea"
                                                    required
                                                    placeholder="Текст ответа"
                                                    value={answer.description}
                                                    onChange={event => setAnswerText(index, ansIndex, event.target.value)}
                                                />
                                                <Form.Control.Feedback type='invalid'>Необходимо заполнить!</Form.Control.Feedback>
                                            </Form.Group>
                                        )
                                        : getType(task.type.id).rule.rule === 1
                                            ? (
                                                <Form.Group className='mt-1 mx-4' key={ansIndex} controlId={`answerValidation1-${index}-${ansIndex}`}>
                                                    <Form.Control
                                                        style={{ width: 410 }}
                                                        type="text"
                                                        required
                                                        placeholder="Текст ответа"
                                                        value={answer.description}
                                                        onChange={event => setAnswerText(index, ansIndex, event.target.value)}
                                                    />
                                                    <Form.Control.Feedback type='invalid'>Необходимо заполнить!</Form.Control.Feedback>
                                                </Form.Group>
                                            )
                                            : (
                                                <Form.Group className='mt-1 mx-4' key={ansIndex} controlId={`answerValidation2-${index}-${ansIndex}`}>
                                                    <Row>
                                                        <Col md={4}>
                                                            <Form.Control
                                                                type="text"
                                                                required
                                                                placeholder="Текст ответа"
                                                                value={answer.description}
                                                                onChange={event => setAnswerText(index, ansIndex, event.target.value)}
                                                            />
                                                            <Form.Control.Feedback type='invalid'>Необходимо заполнить!</Form.Control.Feedback>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                id={`${index}-${ansIndex}`}
                                                                label='Верно'
                                                                checked={answer.isRight}
                                                                onChange={event => setAnswerRight(index, ansIndex, event)}
                                                            />
                                                        </Col>
                                                        <Col md={2}>
                                                            <Button className='mx-2' variant='light' onClick={() => deleteAnswer(index, ansIndex)}>
                                                                <FaMinusCircle color='red' size='1.5em' />
                                                            </Button>
                                                        </Col>

                                                    </Row>
                                                </Form.Group>
                                            )
                                ))
                            }

                            <Button className='mx-4 mt-2' style={{ width: 110 }} variant='danger' onClick={() => deleteTask(index)}>Удалить</Button>
                        </Card>
                    ))
                }

                <Button variant='success' onClick={addTask}>Добавить</Button><br />
                <Button type="submit" style={{ float: 'right' }} className='my-3'>Сохранить работу</Button>
                
                
            </Form>

            <Modal show={showError} onHide={() => (navigate(`/works`))}>
                <Modal.Header closeButton>
                    <Modal.Title>Ошибка</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ errorText }</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleErrorClose}>
                        Ок
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDialog} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>Работа успещно создана. Вы желате вернуться к списку всех работ или приступить к созданной работе?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => (navigate(`/works`))}>
                        Вернуться к списку заданий
                    </Button>
                    <Button variant="primary" onClick={() => (navigate(`/work/${workId}`))}>
                        Написать работу
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default NewWork
