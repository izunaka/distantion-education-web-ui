import React from 'react'

function RightAnswers({ taskResult, tasks, displayAnswers }) {
    const type = tasks.find(task => task.id === taskResult.taskId).type.rule.answer;

    let content;
    if (!displayAnswers) {
        content = '';
    } else if (type === 0) {
        content = (
            <div style={{
                fontSize: 14,
                fontStyle: 'italic'
            }}>
                <b>Правильный ответ:</b><br />
                <span dangerouslySetInnerHTML={{ __html: taskResult.rightAnswers[0].description }}></span>
            </div>
        );
    } else if (type === 1) {
        content = (
            <div style={{
                fontSize: 16,
                fontStyle: 'italic'
            }}>
                Правильные ответы:
                <ul>
                    {
                        taskResult.rightAnswers.map(ans => (
                            <li>{ ans.description }</li>
                        ))
                    }
                </ul>
            </div>
        );
    }

    return content;
}

export default RightAnswers