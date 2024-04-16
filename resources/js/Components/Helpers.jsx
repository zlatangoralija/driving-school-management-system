import React from "react";

export const _navItem = (data, index) => {

    const nodeDD = React.useRef(null);
    const [ expanded, setExpanded ] = React.useState(false)


    //
    //
    const handleClick = async(e) => {
        if (nodeDD.current.contains(e.target)) {
            return;
        }
        if(expanded){
            await _timeout(100)
            setExpanded(false);
        }
    };


    //
    //
    React.useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });


    //
    //
    return(
        <li key={index} className={`${data.active ? 'active' : null} ${data.type ? 'li-'+data.type : null}`} ref={nodeDD}>
            {data.nested ?
                <>
                    <button type="button" onClick={()=>setExpanded(!expanded)} className="aItem">
                        {data.icon ? <span className={data.icon}></span> : null}
                        <span>{data.name}</span>
                    </button>
                    {data.badge ?  <div dangerouslySetInnerHTML={{ __html:data.badge}} /> : null}
                    <button type="button" onClick={()=>setExpanded(!expanded)}><span className={expanded ? 'icon-up' : 'icon-down'}/></button>
                    <ul className={` transition-transform ${expanded ? 'expanded' : ''}`}>
                        {data.nested.map((item,i)=>{
                            return _navItem(item,i)
                        })}
                    </ul>
                </>
                :
                <>
                    <a href={data.url ? data.url : '#'}>
                        {data.icon ? <span className={data.icon}></span> : null}
                        <span>{data.name}</span>
                    </a>
                    {data.badge ?  <div dangerouslySetInnerHTML={{ __html:data.badge}} /> : null}
                </>
            }
        </li>
    )

}
