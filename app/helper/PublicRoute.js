import React from "react"
import {Redirect, Route} from "react-router-dom"
import {ACCESS_TOKEN} from "./constanta"

export const PublicRoute = ({component: Component, ...rest}) => (
    <Route 
        {...rest}
        render={props => localStorage.getItem(ACCESS_TOKEN)
            ? <Redirect to={{
                pathname:"/app", 
                state: {from: props.location}
            }}
            />
            : <Component {...props} />
        }  
    />
)