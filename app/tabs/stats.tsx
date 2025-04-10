import {View, Text, StyleSheet, Switch, ActivityIndicator, ScrollView, Dimensions} from 'react-native';
import CustomButton from "@/app/components/ui/custom-button";
import { Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/app/components/ui/card";
import Separator from "@/app/components/ui/separator";
import {Input} from "@/app/components/ui/input";
import {CustomSwitch} from "@/app/components/ui/switch";
import {TextArea} from "@/app/components/ui/text-area";
import {useGetAppointments} from "@/app/features/appointments/api/use-get-appointments";
import Colors from "@/constants/Colors";
import Svg from "react-native-svg";
import { Pie, PolarChart } from "victory-native";
import {useGetFacilities} from "@/app/features/facilities/api/use-get-facilities";
import {useMemo, useState} from "react";
import {fontFamily} from "nativewind/dist/postcss/to-react-native/properties/font-family";
import { useFont } from "@shopify/react-native-skia";
import {useFonts} from "expo-font";

const screenWidth = Dimensions.get('window').width;

export default function StatsClient() {


    const { data:appointments, isLoading, error }  = useGetAppointments()
    const [dataLabelSegment, setDataLabelSegment] = useState<
        "simple" | "custom" | "none"
    >("simple");


    if (isLoading) {
        return (
            <View className={'flex-1 items-center justify-center'}>
                <ActivityIndicator size={'large'} color={Colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View className={'flex-1 items-center justify-center'}>
                <Text className={'text-red-500'}>Error: {error.message}</Text>
            </View>
        );
    }

    if (!appointments || appointments.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-gray-500 text-center">No appointment data available to generate stats.</Text>
            </View>
        );
    }

    // const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 125;
    function generateRandomColor(): string {
        // Generating a random number between 0 and 0xFFFFFF
        const randomColor = Math.floor(Math.random() * 0xffffff);
        // Converting the number to a hexadecimal string and padding with zeros
        return `#${randomColor.toString(16).padStart(6, "0")}`;
    }

    const COLORS = [
        "#FF6384", // Pink
        "#36A2EB", // Blue
        "#FFCE56", // Yellow
        "#4BC0C0", // Teal
        "#9966FF", // Purple
        "#FF9F40", // Orange
        "#8AC926", // Lime Green
        "#F06543", // Coral
        "#58A4B0", // Cadet Blue
        "#B5E48C", // Light Green
        "#FF00FF", // Magenta/Fuchsia
        "#00FFFF", // Aqua/Cyan
        "#7FFF00", // Chartreuse
        "#FF1493", // Deep Pink
        "#00FF7F", // Spring Green
        "#FF8C00", // Dark Orange
        "#40E0D0", // Turquoise
        "#EE82EE", // Violet
        "#ADFF2F", // Green Yellow
        "#FF69B4", // Hot Pink
    ];

    const facilityDistribution = useMemo(() => {
        //if there is no appointments return an empty array
        if (!appointments || appointments.length === 0) return [];

        //initialize an empty object to hold the facility count
         const facilityCount: {[ key: string  ] : number} ={}

        //loop through the appointments and count the number of appointments per facility
        appointments.forEach(appointment => {
            const facilityName = appointment.facility || 'Unknown Facility'
            facilityCount[facilityName] = (facilityCount[facilityName] || 0) + 1
        })

        const uniqueFacilities = Object.keys(facilityCount);

        const colorMap: Record<string, string> ={}
        uniqueFacilities.forEach((name, index) => {
            colorMap[name] = COLORS[index % COLORS.length];
        });


        const dataPoints = Object.entries(facilityCount).map(([facilityName, facilityCount]) => ({
            x: facilityName, // Facility name becomes the 'x' value
            y: facilityCount,         // Count becomes the 'y' value
            color: colorMap[facilityName],
        }));

         return dataPoints;
    },[appointments])


    return (
        <ScrollView className={'flex-1 p-4 gap-y-2'}>
            <Text className={'text-xl font-bold'}>Facility Distribution</Text>
            <View style={{ height: 300  }}>
                {facilityDistribution?.length > 0 ? (
                    <PolarChart
                        data={facilityDistribution}
                        colorKey={'color'}
                        labelKey={'x'}
                        valueKey={'y'}
                    >
                        <Pie.Chart />
                        {/*    {({ slice }) =>{*/}
                        {/*        return(*/}
                        {/*            <Pie.Slice>*/}
                        {/*                {dataLabelSegment === "simple" && (*/}
                        {/*                    <Pie.Label  color={"black"} >*/}

                        {/*                    </Pie.Label>*/}
                        {/*                )}*/}
                        {/*            </Pie.Slice>*/}
                        {/*        )*/}
                        {/*    }}*/}
                        {/*</Pie.Chart>*/}
                    </PolarChart>
                ) :
                    <Text className="text-center text-gray-500 dark:text-gray-400">
                        No facility data available
                    </Text>
                }


            </View>
            {facilityDistribution && facilityDistribution.length > 0 && (
               <View className="mt-6 w-full px-4 self-start">
                   <Text className='font-semibold mb-2 text-black'>
                       Facilities:
                   </Text>
                   {facilityDistribution.map((facility) =>(
                       <View key={facility.x} className={'flex flex-row items-center mb-2'}>
                           <View
                               style={{ backgroundColor: facility.color }}
                               className="w-3.5 h-3.5 rounded-full mr-2 border border-gray-300 dark:border-gray-600"
                           />
                           <Text className='' ellipsizeMode="tail">
                               {facility.x} - ({facility.y})
                           </Text>

                       </View>

                   ))}
               </View>
            )}
        </ScrollView>
    );
}

