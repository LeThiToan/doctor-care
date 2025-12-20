
$FullImageName = "$ACRName.azurecr.io/$ImageName`:$Tag"

Write-Host "Tagging image: $ImageName`:$Tag -> $FullImageName" -ForegroundColor Yellow
docker tag "${ImageName}:${Tag}" $FullImageName

Write-Host "Pushing image to ACR..." -ForegroundColor Yellow
docker push $FullImageName

Write-Host "✓ Image pushed successfully!" -ForegroundColor Green
Write-Host "Image: $FullImageName" -ForegroundColor Cyan
