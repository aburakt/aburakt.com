import clsx from 'clsx'
import { motion } from 'framer-motion'

type AnimatedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string
  fill?: boolean
}

export function AnimatedImage({
  containerClassName,
  className,
  fill,
  sizes,
  ...props
}: AnimatedImageProps & { sizes?: string }) {
  return (
    <motion.div
      className={clsx('block will-change-transform', containerClassName)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -4 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <img
        {...props}
        className={clsx(
          fill && 'absolute inset-0 h-full w-full',
          className
        )}
      />
    </motion.div>
  )
}
