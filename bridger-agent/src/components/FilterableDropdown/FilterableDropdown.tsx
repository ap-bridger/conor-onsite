import { useRef, useState, useEffect } from "react";
import {
  Box,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";

export type FilterableDisplayElement<T> = {
  key: string;
  displayName: string;
  label: string;
  value: T;
};

export type FilterableDropdownProps<T> = {
  label: string;
  placeholderText: string;
  selectedText?: string;
  options: FilterableDisplayElement<T>[];
  onSelect: (value: T) => void;
  maxHeight?: string;
  onAddNew?: () => void; // New prop for Add New
  onFilterChange?: (value: string) => void;
};

export function FilterableDropdown<T>({
  label,
  placeholderText,
  selectedText,
  options,
  onSelect,
  maxHeight = "400px",
  onAddNew,
  onFilterChange,
}: FilterableDropdownProps<T>) {
  const theme = useTheme();
  const focusRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(selectedText || "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const borderColor = isHovered
    ? theme.colors.brand.blue
    : theme.colors.brand.grey;

  // Keep content in sync with selectedText when dropdown is closed and selectedText changes. This is required for newly created accounts/payees to auto-update the selection.
  useEffect(() => {
    if (!isOpen) {
      setContent(selectedText || "");
    }
  }, [selectedText, isOpen]);

  const handleOpen = () => {
    setContent(selectedText || "");
    setHasEdited(false);
    onOpen();
    setTimeout(() => {
      focusRef.current?.focus();
      focusRef.current?.select();
    }, 0);
  };

  const onPopoverClose = () => {
    onClose();
    setContent(selectedText || "");
    setHasEdited(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    setHasEdited(true);
    if (onFilterChange) {
      onFilterChange(e.target.value);
    }
  };

  const filteredEntries =
    !isOpen || !hasEdited
      ? options
      : options.filter((option) =>
          option.displayName.toLowerCase().includes(content.toLowerCase())
        );

  const _onSelect = (value: FilterableDisplayElement<T>) => {
    onSelect(value.value);
    setContent(value.displayName);
    onClose();
  };

  const addNewElement = onAddNew ? (
    <Box
      px="10px"
      py="5px"
      _hover={{ backgroundColor: "brand.lightGrey" }}
      onClick={() => {
        onAddNew();
        onClose();
      }}
      style={{ cursor: "pointer", fontWeight: 600 }}
      key="add-new"
    >
      <HStack>
        <Text size="md" color="brand.blue">
          + Add new
        </Text>
        <Spacer />
      </HStack>
    </Box>
  ) : null;

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (filteredEntries.length > 0) {
        _onSelect(filteredEntries[0]);
        return;
      }
    }
  };

  const optionElements = [
    ...(addNewElement ? [addNewElement] : []),
    ...filteredEntries.map((entry) => (
      <DropdownRow
        key={entry.key}
        displayName={entry.displayName}
        label={entry.label}
        value={entry}
        onSelect={_onSelect}
        isSelected={selectedText === entry.displayName}
      />
    )),
  ];

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Text size="sm">{label}</Text>
      <Popover
        initialFocusRef={focusRef}
        onClose={onPopoverClose}
        isOpen={isOpen}
        onOpen={handleOpen}
      >
        <PopoverTrigger>
          <HStack
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="5px"
            gap="0px"
            style={{
              cursor: "pointer",
              background: isOpen ? theme.colors.brand.lightGrey : undefined,
            }}
          >
            <input
              type="text"
              ref={focusRef}
              placeholder={placeholderText}
              value={content}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              style={{
                borderTopLeftRadius: "5px",
                borderBottomLeftRadius: "5px",
                borderWidth: "0px",
                fontSize: theme.fontSizes.md,
                width: "100%",
                background: theme.colors.brand.white,
                outline: "none",
              }}
            />
            <IoIosArrowDown
              size="18px"
              style={{
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
          </HStack>
        </PopoverTrigger>
        <PopoverContent maxHeight={maxHeight} overflowY="auto" minWidth="220px">
          {optionElements.length > 0 ? (
            optionElements
          ) : (
            <Box px="10px" py="5px">
              <Text size="md" color={theme.colors.brand.darkGrey}>
                No results
              </Text>
            </Box>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DropdownRow<T>({
  displayName,
  label,
  value,
  onSelect,
  isSelected,
}: {
  displayName: string;
  label: string;
  value: T;
  onSelect: (value: T) => void;
  isSelected?: boolean;
}) {
  return (
    <Box
      px="10px"
      py="5px"
      backgroundColor={isSelected ? "brand.lightGrey" : undefined}
      _hover={{ backgroundColor: "brand.lightGrey" }}
      onClick={() => onSelect(value)}
      style={{ cursor: "pointer" }}
    >
      <HStack>
        <Text size="md">{displayName}</Text>
        <Spacer />
        <Text size="sm">{label}</Text>
      </HStack>
    </Box>
  );
}
