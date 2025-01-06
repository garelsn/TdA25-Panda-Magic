import { Link } from "react-router-dom";
type MyComponentProps = {
    name: string;
    link: string;
  };

const ButtonLink: React.FC<MyComponentProps> = ({ name, link }) => {

    return (
        <div>
            <Link to={link}>{name}</Link>
        </div>

    );
  }
  
  export default ButtonLink;
  