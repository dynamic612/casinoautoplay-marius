// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  BorderOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SmileOutlined,
  StopOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  MenuUnfoldOutlined,
  BoxPlotOutlined,
  StopOutlined,
  BorderOutlined,
  SmileOutlined,
  GatewayOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = {
  id: 'other',
  title: <FormattedMessage id="others" />,
  type: 'group',
  children: [
    {
      id: 'dice',
      title: <FormattedMessage id="dice" />,
      type: 'item',
      url: '/dice',
      icon: icons.ChromeOutlined
    },
    {
      id: 'target',
      title: <FormattedMessage id="target" />,
      type: 'item',
      url: '/target',
      icon: icons.ChromeOutlined
    },
    {
      id: 'mines',
      title: <FormattedMessage id="mines" />,
      type: 'item',
      url: '/mines',
      icon: icons.ChromeOutlined
    },
    {
      id: 'hilo',
      title: <FormattedMessage id="hilo" />,
      type: 'item',
      url: '/hilo',
      icon: icons.ChromeOutlined
    },
    {
      id: 'tower',
      title: <FormattedMessage id="tower" />,
      type: 'item',
      url: '/tower',
      icon: icons.ChromeOutlined
    },
    {
      id: 'rain',
      title: <FormattedMessage id="rain" />,
      type: 'item',
      url: '/rain',
      icon: icons.ChromeOutlined
    }
  ]
};

export default other;
