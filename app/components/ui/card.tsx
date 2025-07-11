import { Text, View } from 'react-native';

import { cn } from '@/lib/utils';

function Card({
                  className,
                  ...props
              }: React.ComponentPropsWithoutRef<typeof View>) {
    return (
        <View
            className={cn('rounded-xl border-none border-border bg-white w-full', className)}
            {...props}
        />
    );
}

function CardHeader({
                        className,
                        ...props
                    }: React.ComponentPropsWithoutRef<typeof View>) {
    return <View className={cn('pr-4 pl-4 pt-2 pb-1', className)} {...props} />;
}

function CardTitle({
                       className,
                       ...props
                   }: React.ComponentPropsWithoutRef<typeof Text>) {
    return (
        <Text
            className={cn(
                'text-2xl font-semibold tracking-normal text-primary',
                className
            )}
            {...props}
        />
    );
}

function CardDescription({
                             className,
                             ...props
                         }: React.ComponentPropsWithoutRef<typeof Text>) {
    return (
        <Text
            className={cn('text-xs text-gray-600', className)}
            {...props}
        />
    );
}

function CardContent({
                         className,
                         ...props
                     }: React.ComponentPropsWithoutRef<typeof View>) {
    return <View className={cn('p-4 pt-0', className)} {...props} />;
}

// TODO: style
function CardFooter({
                        className,
                        ...props
                    }: React.ComponentPropsWithoutRef<typeof View>) {
    return (
        <View
            className={cn(className, 'flex flex-row items-center p-4 pt-0')}
            {...props}
        />
    );
}

interface SimpleCardProps {
    className?: string;
    title?: string;
    description?: string;
    content?: string;
    footer?: string;
}
function SimpleCard({
                        className,
                        title,
                        description,
                        content,
                        footer,
                    }: SimpleCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                {title && (
                    <Text className="text-2xl font-semibold tracking-tight text-primary">
                        {title}
                    </Text>
                )}
                {description && (
                    <Text className="text-sm text-muted-foreground">{description}</Text>
                )}
            </CardHeader>
            {content && (
                <CardContent>
                    <View>
                        <Text className="text-lg text-primary">{content}</Text>
                    </View>
                </CardContent>
            )}
            {footer && (
                <CardFooter>
                    <Text className="text-sm text-muted-foreground">{footer}</Text>
                </CardFooter>
            )}
        </Card>
    );
}

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    SimpleCard,
};