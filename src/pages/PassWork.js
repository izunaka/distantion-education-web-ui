import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { $host } from '../http';
import { Button, Container, Form, Modal, Spinner } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index'
import RightAnswers from '../components/RightAnswers';
import AnswerAnalysis from '../components/AnswerAnalysis';

const PassWork = observer(() => {
    const [work, setWork] = useState({});
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState([]);
    const [score, setScore] = useState();
    const [isPassed, setIsPassed] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    const { settings } = useContext(Context);

    const workId = useParams().id;
    useEffect(() => {
        $host.get(`studentworks/get/${workId}`).then(response => {
            setWork(response.data);
            setAnswers(response.data.tasks.map(task => ({ taskId: task.id, values: [] })));
        }).finally(response => {
            setShowLoading(false);
        })
    }, [workId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        for (const answer of answers) {
            if (!answer.values?.length || (!answer.values[0].valueId && !answer.values[0].valueDescription)) {
                setShowError(true);
                return;
            }
        }

        setShowDialog(true);
    };

    const completeWork = () => {
        setShowDialog(false);
        setShowLoading(true);
        const request = {
            answers,
            currentMethod: settings.currentMethod,
            useFreequency: settings.useFreequency,
            useSysnonyms: settings.useSynonyms,
            synonymsMaxFine: settings.synonymsMaxFine
        };
        $host.post(`check/${workId}`, request).then(response => {
            const result = response.data.tasks;
            enrichResultWithAnalysis(result);
            setResult(result);
            setScore(response.data.totalScore.toFixed(2));
            setIsPassed(true);
        }).finally(() => {
            setShowLoading(false);
        });;
    };

    const setAnswer = (taskId, value) => {
        const answer = answers.find(ans => ans.taskId === taskId);
        if (!answer.values?.length) {
            answer.values = [{}];
        }
        answer.values[0].valueDescription = value;
        setAnswers(deepCopy(answers));
    }

    const changeAnswer = (taskId, answerId) => {
        const answer = answers.find(ans => ans.taskId === taskId);
        const value = answer.values.find(val => val.valueId === answerId);
        if (value) {
            answer.values = answer.values.filter(val => val.valueId !== answerId);
        } else {
            if (work.tasks.find(task => task.id === taskId).type.rule.answer === 0) {
                answer.values = [{ valueId: answerId }];
            } else {
                answer.values.push({ valueId: answerId });
            }
        }
        setAnswers(deepCopy(answers));
    }

    const evaluateScore = (score) => {
        if (score === 1) {
            return {
                text: 'Верно!',
                color: 'green'
            };
        } else if (score > 0.85) {
            return {
                text: 'Отлично!',
                color: 'green'
            };
        } else if (score > 0.7) {
            return {
                text: 'Хорошо.',
                color: 'blue'
            };
        } else if (score > 0.4) {
            return {
                text: 'Удовлетворительно.',
                color: 'orange'
            };
        } else if (score > 0.2) {
            return {
                text: 'Плохо.',
                color: 'red'
            };
        } else if (score > 0) {
            return {
                text: 'Очень плохо.',
                color: 'red'
            };
        } else if (score === 0) {
            return {
                text: 'Неверно.',
                color: 'red'
            };
        }
    };

    const enrichResultWithAnalysis = (tasks) => {
        if (!settings.displayAnalysis) {
            return;
        }

        for (const task of tasks) {
            if (task.generalTerminsInFirstText?.length || task.extraTerminsInFirstText?.length) {
                let rightAnswer = task.rightAnswers[0].description;
                let analysis = answers.find(ans => ans.taskId === task.taskId).values[0].valueDescription;
                for (const termin of task.generalTerminsInFirstText ?? []) {
                    rightAnswer = rightAnswer.replaceAll(termin, `<span style="color: green">${termin}</span>`);
                }
                for (const termin of task.extraTerminsInFirstText ?? []) {
                    rightAnswer = rightAnswer.replaceAll(termin, `<span style="color: red">${termin}</span>`);
                }
                for (const termin of task.generalTerminsInSecondText ?? []) {
                    analysis = analysis.replaceAll(termin, `<span style="color: green">${termin}</span>`);
                }
                for (const termin of task.extraTerminsInSecondText ?? []) {
                    analysis = analysis.replaceAll(termin, `<span style="color: red">${termin}</span>`);
                }
                task.rightAnswers[0].description = rightAnswer; task.analysis = analysis;
            }
        }
    };

    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

    return (
        <Container className='my-3'>
            <h3>{work.name + (isPassed ? ' (Результаты)' : '')}</h3>
            <Form noValidate onSubmit={handleSubmit} className='my-3'>
                {
                    work.tasks?.map((task, index) => (
                        <Form.Group className='my-4' key={task.id}>
                            <Form.Label>{`${index + 1}. ${task.description}`}</Form.Label>
                            {
                                task.type.rule.rule === 2
                                    ? (
                                        <Form.Control
                                            value={answers.find(ans => ans.taskId === task.id).values[0]?.valueDescription}
                                            onChange={event => setAnswer(task.id, event.target.value)}
                                            as="textarea"
                                        />
                                    )
                                    : task.type.rule.rule === 1
                                        ? (
                                            <Form.Control
                                                value={answers.find(ans => ans.taskId === task.id).values[0]?.valueDescription}
                                                onChange={event => setAnswer(task.id, event.target.value)}
                                                style={{ width: 410 }}
                                                type="text"
                                            />
                                        )
                                        : task.answers.map(answer => (
                                            <Form.Check
                                                key={answer.id}
                                                id={answer.id}
                                                type="checkbox"
                                                label={answer.description}
                                                checked={answers.find(ans => ans.taskId === task.id).values.some(val => val.valueId === answer.id)}
                                                onChange={() => changeAnswer(task.id, answer.id)}
                                            />
                                        ))

                            }

                            {
                                isPassed
                                    ? (
                                        <div>
                                            <div style={{
                                                fontSize: 16,
                                                fontStyle: 'italic',
                                                color: evaluateScore(result.find(res => res.taskId === task.id).score).color
                                            }}>
                                                { evaluateScore(result.find(res => res.taskId === task.id).score).text } Вы получили { result.find(res => res.taskId === task.id).score.toFixed(2) } балла.
                                            </div>

                                            <RightAnswers 
                                                taskResult={result.find(res => res.taskId === task.id)} 
                                                tasks={work.tasks} 
                                                displayAnswers={settings.displayAnswers} 
                                            />

                                            <AnswerAnalysis 
                                                taskResult={result.find(res => res.taskId === task.id)} 
                                                tasks={work.tasks} 
                                                displayAnalysis={settings.displayAnalysis} 
                                            />
                                        </div>
                                    ) : ''
                            }
                        </Form.Group>
                    ))
                }

                {
                    isPassed
                        ? (
                            <div style={{ fontSize: 20, fontStyle: 'italic' }}>
                                Вы набрали {score} баллов из {answers.length}.
                            </div>
                        ) : ''
                }

                <Button disabled={isPassed} type="submit" style={{ float: 'right' }} className='my-3'>Завершить</Button>
            </Form>

            <Modal show={showError} onHide={() => setShowError(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ошибка</Modal.Title>
                </Modal.Header>
                <Modal.Body>Необходимо ответить на все вопросы!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowError(false)}>
                        Ок
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите отправить работу на проверку?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={completeWork}>
                        Да
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDialog(false)}>
                        Нет
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showLoading}>
                <Spinner style={{ margin: 'auto' }} className='my-4' variant='primary' />
            </Modal>
        </Container>
    )
});

export default PassWork