function Name(props) {
    return <h1>Hello, {props.name}</h1>;

}

function Url(props) {
    return <h1>Hello, {props.url}</h1>;
}

function NickName(props) {
    return <h1>Hello, {props.nickName}</h1>;
}

function WebApp() {
    return (
        <div>
            <Name name="Shawn" />
            <Url url="https://www.baidu.com" />
            <NickName nickName="Shawn" />
        </div>
    );
}

export default WebApp;
