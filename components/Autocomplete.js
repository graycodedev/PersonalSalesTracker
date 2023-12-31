import React, { memo, useCallback, useRef, useState } from "react";
import { Button, Dimensions, Platform, Text, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Colors } from "../screens/style/Theme";

export const Autocomplete = memo((props) => {
  const [loading, setLoading] = useState(false);
  const [remoteDataSet, setRemoteDataSet] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const getSuggestions = useCallback(async (q) => {
    const filterToken = q.toLowerCase();
    if (typeof q !== "string" || q.length < props.minChars) {
      setRemoteDataSet(null);
      return;
    }
    setLoading(false);
    const items = props.items.map((item, index) => {
      return {
        ...item,
        id: index,
        title: item[`${props.textForAutocomplete}`],
      };
    });

    const suggestions = items
      .filter((item) => item.title.toLowerCase().includes(filterToken))
      .map((item) => ({
        id: item.id,
        title: item.title,
      }));

    setRemoteDataSet(suggestions);
    setLoading(false);
  }, []);

  const getSelected = (item) => {
    if (item != null) {
      let selectedItem = props.items[item.id];
      props.callback(selectedItem);
    }
  };

  return (
    <View style={{ zIndex: 100 }}>
      <AutocompleteDropdown
        dataSet={remoteDataSet}
        closeOnBlur={false}
        useFilter={false}
        clearOnFocus={false}
        textInputProps={{
          placeholder: "Start typing cooperative name",
        }}
        onSelectItem={(item) => getSelected(item)}
        loading={loading}
        onChangeText={getSuggestions}
        // suggestionsListTextStyle={{
        //   color: Colors.primary,
        // }}
        EmptyResultComponent={
          <Text style={{ padding: 10, fontSize: 15 }}>Not found !!</Text>
        }
        onClear={props.onClear}
      />
    </View>
  );
});
