import React from "react";
import { _navItem } from "./Helpers.jsx";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/16/solid/index.js";

const Sidebar = (props) => {
    const navigation = props.navigation

    return(
        <div className={`sidebar ${props.expanded ? 'expanded' : 'collapsed'}`}>

            <button type="button" onClick={()=>props.actionExpand(!props.expanded)} className="expandSidebar">
                {props.expanded ? <ArrowLeftIcon className="h-5"/> : <ArrowRightIcon className="h-5"/>}
            </button>

            <div className="_navigationVertical">
                <ul>
                    {navigation && navigation.map((item,index)=>{
                        return _navItem(item, index, props.active_page)
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
