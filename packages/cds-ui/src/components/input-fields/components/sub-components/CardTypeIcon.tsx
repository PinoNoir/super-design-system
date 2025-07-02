import { Icon } from '@iconify/react';
import React from 'react';

interface CardTypeIconProps {
  cardType: string;
}

const getCCIcon = (cardType: string) => {
  switch (cardType) {
    case 'visa':
      return 'fa:cc-visa';
    case 'mastercard':
      return 'fa:cc-mastercard';
    case 'amex':
      return 'fa:cc-amex';
    case 'discover':
      return 'fa:cc-discover';
    case 'unknown':
    default:
      return 'fa:credit-card';
  }
};

const CardTypeIcon: React.FC<CardTypeIconProps> = ({ cardType }) => {
  const iconName = getCCIcon(cardType);

  return <Icon icon={iconName} width="24px" />;
};

export default CardTypeIcon;
