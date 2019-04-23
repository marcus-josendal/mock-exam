import React from 'react'
import {PrivateRoute} from '../../src/client/components/private-route'
import {mount, shallow} from 'enzyme'
import {MemoryRouter} from 'react-router-dom'

describe('private-route.jsx', () => {
    it('should redirect if no user', () => {
        const driver = mount(
            <MemoryRouter initialEntries={['/admin']}>
                <PrivateRoute path={"/admin"} component={() => <div>Hello</div>} />
            </MemoryRouter>
        )
        expect(driver.find("Router").prop('history').location.pathname)
            .toEqual('/login')
        expect(driver.find("Router").prop('history').location.state.from.pathname)
            .toEqual('/admin')
        expect(driver.html()).toBeNull()
    })

    it('should show route if user prop not null or undefined', () => {
        const driver = mount(
            <MemoryRouter initialEntries={['/admin']}>
                <PrivateRoute path={"/admin"} user={{}} component={() => <div>Hello</div>} />
            </MemoryRouter>
        )
        expect(driver.find("Router").prop('history').location.pathname)
            .toEqual('/admin')
        expect(driver.html()).toContain('Hello')
    });

    it('should allow passing component as render function', () => {
        const driver = mount(
            <MemoryRouter initialEntries={['/admin']}>
                <PrivateRoute path={"/admin"} user={{}} render={() => <div>Hello</div>} />
            </MemoryRouter>
        )
        expect(driver.find("Router").prop('history').location.pathname)
            .toEqual('/admin')
        expect(driver.html()).toContain('Hello')
    });
})
