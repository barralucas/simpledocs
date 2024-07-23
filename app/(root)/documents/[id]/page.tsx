
interface Props {
    name: string;
}

const Document: React.FC<Props> = ({ name }) => {
    return (
        <div>
            <h1>Hello, {name}!</h1>
        </div>
    );
};

export default Document;