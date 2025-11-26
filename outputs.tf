# output "website_endpoint" {
#   value = aws_s3_bucket_website_configuration.website.website_endpoint
# }

output "bucket_name" {
  value = aws_s3_bucket.website.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.website.domain_name
}

output "site_urls" {
  value = [
    "https://projectfall.click",
    "https://www.projectfall.click",
  ]
}
