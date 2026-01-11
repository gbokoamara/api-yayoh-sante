// server/src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (fileBuffer, folder = 'yayoh-sante') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    stream.end(fileBuffer);
  });
};

export default cloudinary;


// // utils/cloudinary.js - Version avec fallback
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// console.log('🔧 Cloudinary config check:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY ? 'PRÉSENT' : 'ABSENT',
//   api_secret: process.env.CLOUDINARY_API_SECRET ? 'PRÉSENT' : 'ABSENT'
// });

// export const uploadToCloudinary = async (fileBuffer, folder = 'yayoh-sante') => {
//   // MODE TEST si Cloudinary non configuré
//   if (!process.env.CLOUDINARY_CLOUD_NAME || 
//       !process.env.CLOUDINARY_API_KEY || 
//       !process.env.CLOUDINARY_API_SECRET) {
    
//     console.log('⚠️ Mode test - Cloudinary non configuré');
    
//     // Retourner une URL de test
//     return {
//       secure_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
//       public_id: 'test-image-' + Date.now(),
//       message: 'Mode test (Cloudinary non configuré)'
//     };
//   }
  
//   // MODE RÉEL Cloudinary
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
//   });

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: 'auto'
//       },
//       (error, result) => {
//         if (error) {
//           console.error('❌ Erreur Cloudinary:', error);
          
//           // Fallback en cas d'erreur Cloudinary
//           resolve({
//             secure_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
//             public_id: 'fallback-' + Date.now(),
//             message: 'Fallback (Cloudinary échoué)'
//           });
//         } else {
//           console.log('✅ Cloudinary upload réussi');
//           resolve(result);
//         }
//       }
//     );
    
//     stream.end(fileBuffer);
//   });
// };