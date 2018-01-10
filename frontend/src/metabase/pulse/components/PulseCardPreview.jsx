/* eslint "react/prop-types": "warn" */
/*eslint-disable react/no-danger */
import React, { Component } from "react";
import PropTypes from "prop-types";

import Icon from "metabase/components/Icon.jsx";
import LoadingSpinner from "metabase/components/LoadingSpinner.jsx";

import cx from "classnames";

export default class PulseCardPreview extends Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        card: PropTypes.object.isRequired,
        cardPreview: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        fetchPulseCardPreview: PropTypes.func.isRequired,
        attachmentsEnabled: PropTypes.bool,
    };

    componentWillMount() {
        this.props.fetchPulseCardPreview(this.props.card.id);
    }

    hasAttachment() {
        const { card } = this.props;
        return card.include_csv || card.include_xls;
    }

    toggleAttachment = () => {
        const { card, onChange } = this.props;
        if (this.hasAttachment()) {
            onChange({ ...card, include_csv: false, include_xls: false })
        } else {
            onChange({ ...card, include_csv: true })
        }
    }

    render() {
        let { card, cardPreview, attachmentsEnabled } = this.props;
        return (
            <div className="flex relative flex-full">
                <div className="absolute top right p1 text-grey-2">
                    { attachmentsEnabled &&
                        <Icon
                            name="clipboard" size={16}
                            className={cx("cursor-pointer py1 pr1 text-brand-hover", { "text-brand": this.hasAttachment() })}
                            onClick={this.toggleAttachment}
                        />
                    }
                    <Icon
                        name="close" size={16}
                        className="cursor-pointer py1 pr1 text-brand-hover"
                        onClick={this.props.onRemove}
                    />
                </div>
                <div className="bordered rounded flex-full scroll-x" style={{ display: !cardPreview && "none" }} dangerouslySetInnerHTML={{__html: cardPreview && cardPreview.pulse_card_html}} />
                { !cardPreview &&
                    <div className="flex-full flex align-center layout-centered pt1">
                        <LoadingSpinner className="inline-block" />
                    </div>
                }
            </div>
        );
    }
}
