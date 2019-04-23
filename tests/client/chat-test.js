import {asyncCheckCondition, overrideFetch, overrideWebSocket} from '../mytest-utils'
const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
import app from '../../src/server/app'
import {Chat} from '../../src/client/views/chat'

let server;
let port;

describe('chat test', function () {
    beforeAll(done => {
        server = app.listen(0, ()=> {
            port = server.address().port;
            overrideWebSocket(port);
            done();
        });
        overrideFetch(app);
    });

    afterAll(() => {
        server.close();
    });


    test("Test new messages", async () => {

        let page = null;
        const history = {push: (h) => {page=h}};

        const driver = mount(
            <MemoryRouter initialEntries={["/chat"]}>
                <Chat history={history} />
            </MemoryRouter>
        );

        const msg  = "Hello!";

        const predicate = () => {
            //needed if changed HTML since component was mounted
            driver.update();
            const html = driver.html();
            return html.includes(msg);
        };
        //?

        //message shouldn't be there... notice that this means this test will always run up to the timeout
        let displayedMessage;

        //create a new message
        const nameInput = driver.find('#usernameChat').at(0);
        const msgInput = driver.find('#chatMessage').at(0);
        const sendBtn = driver.find('#sendMessage').at(0);

        nameInput.simulate('change', {target: {value: "foo"}});
        msgInput.simulate('change', {target: {value: msg}});
        sendBtn.simulate('click');



        displayedMessage = await asyncCheckCondition(predicate, 3000, 100);

        expect(displayedMessage).toBe(true);
    });
});
