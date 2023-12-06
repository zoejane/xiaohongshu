document.getElementById('generate').onclick = async function() {
    const input = document.getElementById('input').value;
    const outputDiv = document.getElementById('output');

    if (!input) {
        alert('输入框不能为空');
        return;
    }

    // 清空原有的输出
    outputDiv.innerHTML = '';

    fetchData(input, (data) => {
        // 将结果返回页面
        outputDiv.innerHTML += data.replace(/\n/g, '<br>');
    });
}

async function fetchData(prompt, onDataReceived) {
    const response = await fetch('/api/generate', {
        method: "post",
        body: JSON.stringify({ prompt }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const reader = response.body.getReader();

    // 实时显示数据
    while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
            break;
        }
        // value的格式是buffer，需要用TextDecoder.decode去解析
        const data = new TextDecoder().decode(value);
  
        // 回调
        onDataReceived(data);
    }
}

// 复制文案到剪贴板
document.getElementById('copy').onclick = function() {
    const outputText = document.getElementById('output').innerText;
    navigator.clipboard.writeText(outputText).then(() => {
        alert('文案已复制到剪贴板');
    }).catch(err => {
        console.error('复制文案失败:', err);
        alert('复制文案失败');
    });
}