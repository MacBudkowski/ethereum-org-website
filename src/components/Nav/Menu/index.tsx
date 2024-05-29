import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Box, type BoxProps, Text, UnorderedList } from "@chakra-ui/react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"

import { Button } from "@/components/Buttons"

import { MAIN_NAV_ID, NAV_PY, SECTION_LABELS } from "@/lib/constants"

import type { NavSections } from "../types"

import { useNavMenu } from "./useNavMenu"

type NavMenuProps = BoxProps & {
  sections: NavSections
}

const Menu = ({ sections, ...props }: NavMenuProps) => {
  const { activeSection, direction, handleSectionChange, isOpen } =
    useNavMenu(sections)

  const MenuContent = dynamic(() => import("./MenuContent"))

  return (
    <Box {...props}>
      <NavigationMenu.Root
        dir={direction}
        orientation="horizontal"
        onValueChange={handleSectionChange}
        delayDuration={0}
      >
        <NavigationMenu.List asChild>
          <UnorderedList
            id={MAIN_NAV_ID}
            display="flex"
            listStyleType="none"
            m="0"
          >
            {SECTION_LABELS.map((sectionKey) => {
              const { label, items } = sections[sectionKey]
              const isActive = activeSection === sectionKey

              return (
                <NavigationMenu.Item key={sectionKey} value={label}>
                  <NavigationMenu.Trigger asChild>
                    <Button
                      py="2"
                      px={{ base: "3", lg: "4" }}
                      variant="ghost"
                      whiteSpace="nowrap"
                      color={isActive ? "primary.base" : "body.base"}
                      _after={{
                        content: '""',
                        position: "absolute",
                        insetInline: 0,
                        top: "100%",
                        height: NAV_PY,
                      }}
                    >
                      {/* Animated highlight for active section */}
                      {isActive && (
                        <Box
                          as={motion.div}
                          layoutId="active-section-highlight"
                          position="absolute"
                          inset="0"
                          bg="primary.lowContrast"
                          rounded="base"
                          zIndex={0}
                        />
                      )}
                      <Text as="span" position="relative" zIndex={1}>
                        {label}
                      </Text>
                    </Button>
                  </NavigationMenu.Trigger>
                  {/* avoid rendering desktop menu on mobile */}
                  {/* Desktop Menu content */}
                  <MenuContent
                    items={items}
                    isOpen={isOpen}
                    sections={sections}
                  />
                </NavigationMenu.Item>
              )
            })}
          </UnorderedList>
        </NavigationMenu.List>

        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    </Box>
  )
}

export default Menu
