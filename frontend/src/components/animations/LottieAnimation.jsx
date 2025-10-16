import React from 'react'

/**
 * Placeholder component to replace LottieAnimation
 * This prevents breaking the application while we remove Lottie dependencies
 */
const LottieAnimation = ({ 
  className = '', 
  style = {}, 
  animationData,
  width,
  height,
  config,
  ...props 
}) => {
  // Filter out Lottie-specific props to avoid React warnings
  const { 
    animationData: _animationData,
    width: _width,
    height: _height,
    config: _config,
    ...domProps 
  } = props

  return (
    <div 
      className={`inline-block ${className}`}
      style={{
        width: width || '24px',
        height: height || '24px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        ...style
      }}
      {...domProps}
    />
  )
}

export default LottieAnimation