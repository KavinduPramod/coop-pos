import {React,useState} from 'react';
import  './style.css';
import { useNavigate } from 'react-router-dom';
import Receipt from '../../images/receipt_icon.png';
import Withdrow from '../../images/withdrow_icon.png';
import History from '../../images/receipt_history.png';
import View from '../../images/view.png';

const Menu = (props) => {
    const value = props.value;
    const navigate = useNavigate();
    const [activevalue, setActive] = useState("home");

    const handleClick = (value) => {
        setActive(value);
        navigate('/'+value);
        console.log(value);
    };

    return (
    <div>
        <div className="row menu_list">
            <div className="col-3">
                <button className={`btn w-100 ${(activevalue==="home")?"active":""}`} type='button' onClick={() => handleClick("home")}>
                    <img src={Receipt} className="icon"/>
                </button>
            </div>
            <div className="col-3">
                <button className={`btn w-100 ${(activevalue==="transaction")?"active":""}`} type='button' onClick={() => handleClick("transaction")}>
                    <img src={Withdrow} className="icon"/>
                </button>
            </div>
            <div className="col-3">
                <button className={`btn w-100 ${(activevalue==="abc")?"active":""}`}>
                    <img src={History} className="icon"/>
                </button>
            </div>
            <div className="col-3">
                <button className={`btn w-100 ${(activevalue==="abc")?"active":""}`}>
                    <img src={View} className="icon"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Menu;