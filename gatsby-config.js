// gatsby-config.js
const siteUrl = `https://kind-curie-54e7b1.netlify.app`
module.exports = {
  siteMetadata: {
    title: 'Gatsby + Netlify CMS Starter',
    description:
      'This repo contains an example business website that is built with Gatsby, and Netlify CMS.It follows the JAMstack architecture by using Git as a single source of truth, and Netlify for continuous deployment, and CDN distribution.',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-json-output`,
      options: {
        siteUrl: siteUrl, // defined on top of plugins
        graphQLQuery: `
          {
            allMarkdownRemark(limit: 1000) {
              edges {
                node {
                  excerpt
                  html
                  fields { path }
                  frontmatter {
                    title
                    created
                    updated
                  }
                }
              }
            }
          }
        `,
        serialize: results => results.data.allMarkdownRemark.edges.map(({ node }) => ({
          path: node.fields.path, // MUST contain a path
          title: node.frontmatter.title,
          created: node.frontmatter.created,
          updated: node.frontmatter.updated,
          html: node.html,
        })),
        feedMeta: {
          author: {
            name: 'Patrick',
          },
          description: 'test123',
          favicon: `${siteUrl}/icons/icon-48x48.png`,
          title: 'testsite',
        },
        serializeFeed: results => results.data.allMarkdownRemark.edges.map(({ node }) => ({
          id: node.fields.path,
          url: siteUrl + node.fields.path,
          title: node.frontmatter.title,
          date_published: new Date(node.frontmatter.created).toISOString(),
          date_modified: new Date(node.frontmatter.updated).toISOString(),
          excerpt: node.excerpt,
        })),
        nodesPerFeedFile: 100,
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: 'gatsby-plugin-purgecss', // purges all unused/unreferenced css rules
      options: {
        develop: true, // Activates purging in npm run develop
        purgeOnly: ['/all.sass'], // applies purging only on the bulma css file
      },
    }, // must be after other CSS plugins
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
