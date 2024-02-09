import { Text, View } from "react-native";

export const Day = ({ name }: { name: string }) => {
  return (
    <View>
      <Text>This is the Day component. Does it also work? </Text>
      <Text>Hello world, {name} </Text>
    </View>
  );
};
