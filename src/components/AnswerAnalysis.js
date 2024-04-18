import React from 'react'

function AnswerAnalysis({ taskResult, tasks, displayAnalysis }) {
    const type = tasks.find(task => task.id === taskResult.taskId).type.rule.rule;
    let content;
    if (!displayAnalysis || type !== 2) {
        content = '';
    } else {
        content = (
            <div style={{
                fontSize: 14,
                fontStyle: 'italic'
            }}>
                <b>Анализ данного ответа:</b><br />
                <span dangerouslySetInnerHTML={{ __html: taskResult.analysis }}></span><br />
            </div>
        );
    }

    return content;
}

export default AnswerAnalysis