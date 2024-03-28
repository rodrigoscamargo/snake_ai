// import './game'
// import './qlearning'
// import './user_interface'
import { terceiroNome } from './teste'
import './style.css'

function primeiroNome() {
    return "Tiago"
}

export default function Snake() {
    const sobrenome = 'Alves'
    
    function segundoNome() {
        return sobrenome
    }

    return (
        <>
            <h1>{primeiroNome()} {segundoNome()} de {terceiroNome()}</h1>
            <h1>Snake</h1>
        </>
    )
}