import React from 'react';
import ReactDOM from 'react-dom/client';

const name = 'runoob';
const now = new Date().toLocaleString();
const items = [
    { id: 1, name: '苹果' },
    { id: 2, name: '香蕉' },
    { id: 3, name: '橙子' },
];

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }


    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleDateString()} {this.state.date.toLocaleTimeString()}.</h2>
                <h1>{name}</h1>
                <h2>当前时间 {now}</h2>
                <ul>
                    {items.map(item => (
                        <li key={item.id}>  {/* key 必须唯一且稳定！ */}
                            {item.name}
                        </li>
                    ))}
                </ul>
                <div
                    style={{
                        backgroundColor: '#f0f0f0',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif',
                    }}
                >
                    <h2 style={{ color: 'blue', marginBottom: '10px' }}>
                        内联样式示例
                    </h2>
                </div>
            </div>


        );
    }
}

export default Clock;