import React, { useContext } from 'react'
import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { Context } from '../index'
import { observer } from 'mobx-react-lite';

const Settings = observer(() => {
    const { settings } = useContext(Context);
    return (
        <Container className='my-3'>
            <h4>Общие настройки</h4>
            <Form.Group className='mt-1 mx-4'>
                <Form.Check
                    type="checkbox"
                    id='trueAnswersCheckbox'
                    label='Отображать верные ответы после отправки работы'
                    checked={settings.displayAnswers}
                    onChange={() => settings.setDisplayAnswers(!settings.displayAnswers)}
                />
            </Form.Group>
            <Form.Group className='mt-1 mx-4'>
                <Form.Check
                    type="checkbox"
                    id='answersAnalisysCheckbox'
                    label='Отображать анализ развернутых ответов после отправки работы'
                    checked={settings.displayAnalysis}
                    onChange={() => settings.setDisplayAnalysis(!settings.displayAnalysis)}
                />
            </Form.Group>

            <h4 className='mt-3'>Настройки анализа развернутых ответов</h4>
            <FloatingLabel className='my-3 mx-4' controlId='currentMethod' label='Применяемый алгоритм'>
                <Form.Select
                    style={{ width: 410 }}
                    value={settings.currentMethod}
                    onChange={({ target }) => settings.setCurrentMethod(target.value)}
                >
                    <option value='jaccard'>Сходство Жаккара</option>
                    <option value='tfidf'>Мера TF-IDF</option>
                    <option value='bert'>Модель глубокого обучения BERT</option>
                </Form.Select>
            </FloatingLabel>
            <Form.Group className='mt-1 mx-4'>
                <Form.Check
                    type="checkbox"
                    id='useFreequencyCheckbox'
                    label='Учитывать частоту появления слов в тексте (для сходства Жаккара)'
                    checked={settings.useFreequency}
                    onChange={() => settings.setUseFreequency(!settings.useFreequency)}
                />
            </Form.Group>
            <Form.Group className='mt-1 mx-4'>
                <Form.Check
                    type="checkbox"
                    id='useSynonymsCheckbox'
                    label='Учитывать синонимы при сравнении'
                    checked={settings.useSynonyms}
                    onChange={() => settings.setUseSynonyms(!settings.useSynonyms)}
                />
            </Form.Group>
            <FloatingLabel className='my-3 mx-4' controlId='synonymsMaxFine' label='Максимальный штраф за синонимы (число от 0 до 1)'>
                <Form.Control
                    type="number"
                    placeholder='Максимальный штраф за синонимы (число от 0 до 1)'
                    style={{ width: 410 }}
                    value={settings.synonymsMaxFine}
                    onChange={({ target })  => settings.setSynonymsMaxFine(target.value)}
                />
            </FloatingLabel>
        </Container>
    )
});

export default Settings