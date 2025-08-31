import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, List } from "lucide-react";
import AnnotateTab from "@/components/annotation/AnnotateTab";
import AnnotatedListTab from "@/components/annotation/AnnotatedListTab";

export default function AnnotationPage() {
  const [activeTab, setActiveTab] = useState("annotate");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Image Annotation</h1>
          <p className="text-text-muted mt-1 text-sm sm:text-base">
            Annotate safety violations in images
          </p>
        </div>
      </div>

      <Card className="glass-panel">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-text-primary flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-adani-primary" />
              <span className="text-lg sm:text-xl">Annotation Tools</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-12 sm:h-auto">
              <TabsTrigger 
                value="annotate" 
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <PenTool className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Annotate</span>
                <span className="sm:hidden">Draw</span>
              </TabsTrigger>
              <TabsTrigger 
                value="annotated-list" 
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <List className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Annotated List</span>
                <span className="sm:hidden">List</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="annotate" className="mt-0">
              <AnnotateTab />
            </TabsContent>

            <TabsContent value="annotated-list" className="mt-0">
              <AnnotatedListTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}