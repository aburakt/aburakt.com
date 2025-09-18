'use client'

import clsx from 'clsx'
import Image, { type ImageProps } from 'next/image'
import { motion } from 'framer-motion'

type AnimatedImageProps = ImageProps & {
  containerClassName?: string
}

export function AnimatedImage({
  containerClassName,
  className,
  ...props
}: AnimatedImageProps) {
  return (
    <motion.div
      className={clsx('block will-change-transform', containerClassName)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -4 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Image {...props} className={className} />
    </motion.div>
  )
}
