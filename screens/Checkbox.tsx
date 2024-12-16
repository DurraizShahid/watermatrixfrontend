const CustomCheckbox = ({ value, onValueChange, label }) => (
    <View style={styles.checkbox}>
        <CheckBox
            value={value}
            onValueChange={onValueChange}
            tintColors={{ true: '#1EABA5', false: 'gray' }}
        />
        <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
);
