import expect from 'expect';
import sinon from 'sinon';
import React, {Component, Children, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import TestUtils from 'react-addons-test-utils';
import connectState from '../src/connectState';
import * as actionTypes from '../src/actionTypes';


describe('redux-state', ()=> {
    describe('connectState', ()=> {
        const createStoreWithStates = (states = {})=>createStore(()=>({
            _states: states
        }));

        class Passthrough extends Component {
            render() {
                return (
                    <div {...this.props}/>
                );
            }
        }

        class ProviderMock extends Component {
            getChildContext() {
                return {store: this.props.store};
            }

            render() {
                return Children.only(this.props.children);
            }
        }

        ProviderMock.childContextTypes = {
            store: PropTypes.object.isRequired
        };

        it('should throw error when connectState called first time without reducer', ()=> {
            @connectState()
            class Container extends Component {
                render() {
                    return (
                        <Passthrough {...this.props}/>
                    );
                }
            }

            expect(()=>TestUtils.renderIntoDocument(
                <ProviderMock store={{}}>
                    <Container/>
                </ProviderMock>
            )).toThrow(/with reducer/);
        });


        it('should call dispatch with initial action', ()=> {
            const stateId = '001';
            const store = createStoreWithStates({
                [stateId]: {}
            });
            const dispatchSpy = sinon.spy(store, 'dispatch');
            const stateReducer = ()=>({});

            @connectState(undefined, undefined, undefined, stateReducer)
            class Container extends Component {
                render() {
                    return (
                        <Passthrough {...this.props}/>
                    );
                }
            }

            TestUtils.renderIntoDocument(
                <ProviderMock store={store}>
                    <Container stateId={stateId}/>
                </ProviderMock>
            );


            expect(dispatchSpy.withArgs({
                type: actionTypes.INIT_STATE,
                payload: {
                    stateReducer,
                    stateId
                }
            }));
        });

        it('should call dispatch with removal action', (done)=> {
            const stateId = '001';
            const store = createStoreWithStates({
                [stateId]: {}
            });
            const dispatchSpy = sinon.spy(store, 'dispatch');
            const stateReducer = ()=>({});

            @connectState(undefined, undefined, undefined, stateReducer)
            class Container extends Component {
                render() {
                    return (
                        <Passthrough {...this.props}/>
                    );
                }
            }

            const div = document.createElement('div');
            ReactDOM.render(
                <ProviderMock store={store}>
                    <Container stateId={stateId}/>
                </ProviderMock>
                , div);

            ReactDOM.unmountComponentAtNode(div);

            setTimeout(()=> {
                expect(dispatchSpy.withArgs({
                    type: actionTypes.REMOVE_STATE,
                    payload: {
                        stateId
                    }
                }).calledOnce).toBeTruthy();
                done()
            }, 0);
        });

        it('should call dispatch with stateId', ()=> {
            const stateId = '001';
            const store = createStoreWithStates({
                [stateId]: {
                    state: {}
                }
            });
            const dispatchSpy = sinon.spy(store, 'dispatch');
            const stateReducer = ()=>({});

            @connectState(undefined, undefined, undefined, stateReducer)
            class Container extends Component {
                render() {
                    return (
                        <Passthrough {...this.props}/>
                    );
                }
            }

            const tree = TestUtils.renderIntoDocument(
                <ProviderMock store={store}>
                    <Container stateId={stateId}/>
                </ProviderMock>
            );
            const passthrough = TestUtils.findRenderedComponentWithType(tree, Passthrough);

            passthrough.props.stateDispatch({
                type: 'SOME_TYPE'
            });

            expect(dispatchSpy.withArgs({
                type: 'SOME_TYPE',
                stateId
            }).calledOnce).toBeTruthy();
        });
    });
});