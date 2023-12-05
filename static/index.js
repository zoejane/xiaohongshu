document.getElementById('generate').onclick = async function() {
    const input = document.getElementById('input').value;
    if (!input) {
      alert('输入框不能为空');
      return;
    }
    fetchData(input, (data) => {
      // 将结果返回页面
      document.getElementById('output').innerHTML += data.replace(/\n/g, '<br>');
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
        data = new TextDecoder().decode(value);
  
        // 回调
        onDataReceived(data)
    }
  }
