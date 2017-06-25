import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class ChooseOCRModal extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            open: props.open
        };
    }

    componentWillReceiveProps (newProps) {
        if (newProps && typeof newProps.open !== "undefined" && newProps.open !== this.state.open) {
            this.setState({ open: newProps.open });
        }
    }

    processOCR = recognize => {
        window.EventBus.emit('chooseOCR', recognize, this.props.image);
    };

    render () {
        const getMsg  = this.props.getMsg,
              actions = [
                  <FlatButton
                      label={getMsg('ocrModal.processOCR')}
                      primary={true}
                      onTouchTap={this.processOCR.bind(this, true)}
                  />,
                  <FlatButton
                      label={getMsg('ocrModal.addImage')}
                      primary={true}
                      onTouchTap={this.processOCR.bind(this, false)}
                  />
              ];

        return (
            <div>
                <Dialog
                    title={getMsg('ocrModal.title')}
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    {getMsg('ocrModal.body')}
                    {this.props.completed
                        ? <div className="text-center">
                            <CircularProgress
                                mode="determinate"
                                value={this.props.completed}
                                size={60}
                                thickness={7}
                            />
                        </div>
                        : ''}
                </Dialog>
            </div>
        );
    }
}
