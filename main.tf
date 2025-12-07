data "aws_caller_identity" "current" {}


resource "aws_s3_bucket" "website" {
  bucket = "projectfall.click"   

  tags = {
    Name = "projectfall-website"
  }
}

resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_acl" "website" {
  depends_on = [
    aws_s3_bucket_ownership_controls.website,
    aws_s3_bucket_public_access_block.website,
  ]

  bucket = aws_s3_bucket.website.id
  acl    = "private"
}

############################


data "aws_route53_zone" "main" {
  name         = "projectfall.click."
  private_zone = false
}

resource "aws_acm_certificate" "site_cert" {
  provider = aws.us-east-1

  domain_name               = "projectfall.click"
  subject_alternative_names = ["www.projectfall.click"]

  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "site_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site_cert.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = data.aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "site_cert_validation" {
  provider = aws.us-east-1

  certificate_arn         = aws_acm_certificate.site_cert.arn
  validation_record_fqdns = [for r in aws_route53_record.site_cert_validation : r.fqdn]
}


resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "projectfall-s3-oac"
  description                       = "OAC for private S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "website" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "Projectfall static site via CloudFront"
  aliases         = ["projectfall.click", "www.projectfall.click"]

  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "s3-origin-${aws_s3_bucket.website.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
    s3_origin_config {
      origin_access_identity = ""
    }
  }

  default_root_object = "site/index.html"

  default_cache_behavior {
    target_origin_id       = "s3-origin-${aws_s3_bucket.website.id}"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.site_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  depends_on = [
    aws_acm_certificate_validation.site_cert_validation
  ]
}

data "aws_iam_policy_document" "website_bucket_policy" {
  statement {
    sid    = "AllowCloudFrontRead"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.website.arn}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.website.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.website_bucket_policy.json
}

resource "aws_route53_record" "root_a" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "projectfall.click"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_a" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.projectfall.click"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}
//lambda

# data "aws_iam_policy_document" "lambda_secretsmanager_policy" {
#   statement {
#     effect = "Allow"

#     actions = [
#       "secretsmanager:GetSecretValue"
#     ]

#     resources = [
#       aws_secretsmanager_secret.api_secret.arn
#     ]
#   }
# }
# resource "aws_iam_role" "lambda_role" {
#   name = "lambda-secretsmanager-role"

#   assume_role_policy = data.aws_iam_policy_document.lambda_trust.json
# }

# data "aws_iam_policy_document" "lambda_trust" {
#   statement {
#     effect = "Allow"

#     principals {
#       type        = "Service"
#       identifiers = ["lambda.amazonaws.com"]
#     }

#     actions = ["sts:AssumeRole"]
#   }
# }
# # resource "aws_iam_policy" "lambda_secretsmanager" {
# #   name        = "lambda-secretsmanager"
# #   description = "Allow Lambda to read secret"
# #   policy      = data.aws_iam_policy_document.lambda_secretsmanager_policy.json
# # }

# # resource "aws_iam_role_policy_attachment" "lambda_attach" {
# #   role       = aws_iam_role.lambda_role.name
# #   policy_arn = aws_iam_policy.lambda_secretsmanager.arn
# # }

# # //secret_manager
# # resource "aws_secretsmanager_secret" "api_secret" {
# #   name = "api-key"
# #   description = "key for projectfall"
# # }

# # resource "aws_secretsmanager_secret_version" "api_secret_value" {
# #   secret_id     = aws_secretsmanager_secret.api_secret.id
# #   secret_string = jsonencode({
# #     API_KEY = trimspace(file(var.api_key_file))})
# # }

# # resource "aws_lambda_function" "my_lambda" {
# #   function_name = "my-lambda"
# #   role          = aws_iam_role.lambda_role.arn
# #   handler       = "page-main.html"//"index.handler"  
# #   runtime       = "nodejs18.x"

# #   filename = "lambda.zip"
# # }
