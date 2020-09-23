import React, { PureComponent } from 'react';
import { Card, Icon } from 'antd';
import styles from './index.less';

class CustomCard extends PureComponent {
  state = {
    childOpen: true,
  };

  controlChildren = () => {
    this.setState(prevState => ({
      childOpen: !prevState.childOpen,
    }));
  };

  render() {
    const { title, loading } = this.props;
    const { childOpen } = this.state;
    let { children } = this.props;
    let noPadding = null;

    if (!childOpen) {
      children = null;
      noPadding = 'noPadding';
    }

    return (
      <Card className={`${styles.customCard} ${styles[noPadding]}`} title={title} loading={loading}>
        {childOpen ? (
          <Icon className={styles.icon} type="up" onClick={this.controlChildren} />
        ) : (
          // <MdKeyboardArrowUp onClick={this.controlChildren} />
          <Icon className={styles.icon} type="down" onClick={this.controlChildren} />
          // <MdKeyboardArrowDown onClick={this.controlChildren} />
        )}
        {children}
      </Card>
    );
  }
}

export default CustomCard;
