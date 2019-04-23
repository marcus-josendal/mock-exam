import React from 'react'
import {Redirect, Route} from 'react-router-dom'

const isNullOrUndefined = value => value === null || typeof value === 'undefined'

export const PrivateRoute = ({ component: Component, user, render: RenderComponent, ...rest}) =>
    <Route {...rest} user={user} render={(props) => (
        isNullOrUndefined(user) ?
            <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
            }} /> :
            isNullOrUndefined(Component) ?
                <RenderComponent {...props} /> :
                <Component {...props} />
    )} />

export default PrivateRoute
