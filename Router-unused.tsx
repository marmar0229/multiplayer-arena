import {createBrowserRouter} from 'react-router-dom'
import { CanvasContainer } from './CanvasContainer'

const Router = createBrowserRouter([{
element : <CanvasContainer />,
path: '/canvas',
loader: ()=>{fetch('/trackusercan')}
}])
// gtuser sent and info to track which player and upddate schema if needed 