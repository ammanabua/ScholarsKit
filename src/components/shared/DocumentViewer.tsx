'use client'
import { ArrowRight, FileText, FolderPlus, PlusCircle } from 'lucide-react'
import React from 'react'

const DocumentViewer = () => {

  const handleUploadDocument = () => {
    // Logic to handle document upload
    console.log("Upload Document clicked");
  }

  const handleCreateCourse = () => {
    // Logic to handle course creation
    console.log("Create Course clicked");
  }
  
  return (
    <>
      {/* Main Content Area */}
      <div className="flex-1 flex min-h-screen">
        {/* Document Viewer */}
        <div className="flex-1 bg-white">
          {/* Document Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800 font-medium">Welcome to ScholarsKit</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Document Content */}
          <div className="p-8 max-w-4xl mx-auto">
            {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">
              The Impact of Climate Change on Biodiversity
            </h1>
            
            <div className="prose prose-lg text-gray-700 space-y-6">
              <p>
                Climate change can an affects, extremsus haitwriting and mitigation factors, impacting ecosystems, species distributions, and limitingagemantations, and risc. Associated withroare resqach, and future research to mitigate future reqeusts.
              </p>
              
              <p>
                Climate change is an impact on hajpl climate and habitats, fome individuals, viajcno distirutions, species distributions, and amirantions. Emirging sites or Characning and cnticatization between natural disasters and species. The impact of threatens affects by mouern diversity, biodiversity and impacting ecosystems.
              </p>
              
              <p>
                Mitigation strategies can lead to reliancesement into vulners recerai- and amerging significant fictures. Despite future research, and future research gives you fast, reliaciebl, undetgratn2, or sccuttid-research, ci.
              </p>
            </div> */}

            <div className='flex flex-col min-h-[60vh] items-center justify-center gap-4'>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Get Started with ScholarsKit
              </h1>
              <div className='flex gap-4'>
                <button onClick={handleUploadDocument} className='flex border border-yellow-600 p-4 rounded-lg text-gray-700 gap-2 cursor-pointer'><PlusCircle />Upload Document</button>
                <button onClick={handleCreateCourse} className='flex border border-yellow-600 p-4 rounded-lg text-gray-700 gap-2 cursor-pointer'><FolderPlus />Create a Course</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DocumentViewer