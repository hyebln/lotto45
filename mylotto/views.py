import datetime
import random

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import LottoList, LottoResult


# Create your views here.
def get_lotto_data(request):
    queries = {}
    response_data = {'number': []}  # 기본 응답 형태
    includeNum = eval(request.GET.get('include_num'))
    excludeWin = request.GET.get('exclude_win')
    excludeThree = request.GET.get('exclude_three')

    extract_result = list(LottoResult.objects.values_list('num1', 'num2', 'num3', 'num4', 'num5', 'num6', flat=False).order_by('round'))
    extract_numbers=[]
    if excludeThree:
        recentthree = extract_result[-3:]
        extract_numbers = set(recentthree[0])
        for numbers in recentthree[1:]:
            extract_numbers.intersection_update(numbers)
        extract_numbers.difference_update(includeNum)

    if not excludeWin:
        extract_result = []



    for param in ['odd_cnt', 'prime_cnt', 'small_cnt', 'consq_cnt']:
        value = request.GET.get(param)
        if value != '-1':
            queries[param] = int(value)
    print(queries)
    print(datetime.datetime.now())
    if queries == {}:
        selected = includeNum
        all_numbers = set(range(1, 46))
        all_numbers.difference_update(excludeThree)
        while True:
            randomselect = random.sample(all_numbers, 6-len(selected)) + selected
            randomselect.sort()
            if tuple(randomselect) in extract_result:
                continue
            else:
                break
        response_data = {'number': str(randomselect)}  # 'number' 필드가 있다고 가정
        return JsonResponse(response_data)

    datas = list(LottoList.objects.filter(**queries).values_list('lottogroup'))
    print('1step', datetime.datetime.now())
    newdatas = []
    if datas != []:
        if includeNum != []:
            stop = False
            for d in datas:
                dt_list = eval(d[0])
                for dt in dt_list:
                    if all(element in dt for element in includeNum):
                        if tuple(dt) in extract_result:
                            continue
                        for i in extract_numbers:
                            if i in dt:
                                break
                        newdatas.append(dt)
                        if len(newdatas) > 10000:
                            stop = True
                if stop:
                    print(len(newdatas))
                    break

        else:
            stop = False
            for d in datas:
                dt_list = eval(d[0])
                for dt in dt_list:
                    if tuple(dt) in extract_result:
                        continue
                    for i in extract_numbers:
                        if i in dt:
                            break
                    newdatas.append(dt)
                    if len(newdatas) > 150000:
                        stop = True
                if stop:
                    print(len(newdatas))
                    break

        idxmax = len(newdatas)
        idx = random.choice(range(idxmax))
        data = newdatas[idx]
        response_data = {'number': str(data)}  # 'number' 필드가 있다고 가정

    else:
        response_data = {'number': '[]'}

    print(datetime.datetime.now())

    return JsonResponse(response_data)
def main_page(request):
    context = {}
    return render(request, "index.html", context)

